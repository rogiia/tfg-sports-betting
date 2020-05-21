package grpc

import (
	"context"
	"log"
	"net"

	pb "./balance-service"
	"google.golang.org/grpc"

	"../models"
)

const (
	port = ":50051"
)

type server struct {
	pb.UnimplementedBalanceServiceServer
}

func (s *server) PayBet(ctx context.Context, in *pb.PayBetRequest) (*pb.PayBetResponse, error) {
	var userID = in.GetUserId()
	var amount = in.GetAmount() * -1
	var _, err = models.AddBalance(userID, amount)
	if err != nil {
		var response = false
		return &pb.PayBetResponse{OK: &response}, err
	}
	var response = true
	return &pb.PayBetResponse{OK: &response}, nil
}

func (s *server) CashBet(ctx context.Context, in *pb.CashBetRequest) (*pb.CashBetResponse, error) {
	var userID = in.GetUserId()
	var amount = in.GetPrize()
	var _, err = models.AddBalance(userID, amount)
	if err != nil {
		var response = false
		return &pb.CashBetResponse{OK: &response}, err
	}
	var response = true
	return &pb.CashBetResponse{OK: &response}, nil
}

// Start : Start grpc server
func Start() {
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	var s = grpc.NewServer()
	pb.RegisterBalanceServiceServer(s, &server{})
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
